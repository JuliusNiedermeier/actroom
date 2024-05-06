import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useEffect, useMemo } from "react";
import { getDocumentAsync } from "expo-document-picker";
import { trpc } from "@/services/trpc";
import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PlayScreen: FC = () => {
  const { playID } = useLocalSearchParams<{ playID: string }>();
  const navigation = useNavigation();
  const { push } = useRouter();
  const { play } = trpc.useUtils();

  const { data: playData, refetch: refetchPlay } = trpc.play.getOne.useQuery({
    ID: playID,
  });

  const updatePlayMutation = trpc.play.update.useMutation({
    onSuccess: () => refetchPlay(),
  });

  const createSourcePartMutation = trpc.sourcePart.create.useMutation({
    onSuccess: () => refetchPlay(),
  });

  const updateSourcePartMutation = trpc.sourcePart.update.useMutation({
    onSuccess: () => refetchPlay(),
  });

  const startConversionMutation = trpc.play.convert.useMutation({
    onMutate: () => {
      play.getOne.setData(
        { ID: playID },
        (data) => data && { ...data, conversionStatus: "processing" }
      );
    },
    onSuccess: () => refetchPlay(),
  });

  useEffect(() => {
    if (!playData || playData.visited) return;
    updatePlayMutation.mutate({ ID: playID, data: { visited: true } });
  }, [playData]);

  const handleOptionsPress = () => {
    push({ pathname: "/play/[playID]/settings/", params: { playID } });
  };

  const playStatus = useMemo(() => {
    if (!playData) return null;
    if (playData.sourceParts.length < 1) return "awaiting-upload";
    if (playData.sourceParts.filter((part) => part.upload_complete).length < 1)
      return "uploading";

    return playData.conversionStatus;
  }, [playData]);

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      headerTitle: playData?.title || "",
      headerRight: () => (
        <Pressable
          onPress={handleOptionsPress}
          style={({ pressed }) => ({
            padding: 4,
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons name="ellipsis-vertical" size={20} />
        </Pressable>
      ),
    });
  }, [navigation, playData]);

  const selectDocument = async () => {
    const selection = await getDocumentAsync({
      multiple: false,
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (selection.canceled) return;
    const file = selection.assets[0];
    if (!file) return;

    const fileResponse = await fetch(file.uri);
    const fileBlob = await fileResponse.blob();

    const { sourcePart, uploadURL } =
      await createSourcePartMutation.mutateAsync({
        playID,
        type: "pdf",
      });

    const response = await fetch(uploadURL, {
      method: "PUT",
      headers: { "Content-Type": fileBlob.type },
      body: fileBlob,
    });

    if (!response.ok) return alert("Upload failed");

    await updateSourcePartMutation.mutateAsync({
      ID: sourcePart.ID,
      data: { upload_complete: true },
    });
  };

  useEffect(() => {
    if (playData?.visited === false) selectDocument();
  }, [playData?.visited]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {playStatus === "awaiting-upload" && (
        <Pressable
          onPress={selectDocument}
          style={({ pressed }) => ({
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: "white",
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text>Select PDF</Text>
        </Pressable>
      )}

      {playStatus === "uploading" && <Text>Uploading...</Text>}

      {playStatus === "pending" && (
        <Pressable
          onPress={() => startConversionMutation.mutate({ ID: playID })}
          style={({ pressed }) => ({
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: "white",
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Text>Start conversion</Text>
        </Pressable>
      )}

      {playStatus === "processing" && <Text>Processing...</Text>}
      {playStatus === "complete" && <Text>Complete</Text>}
    </View>
  );
};

export default PlayScreen;
