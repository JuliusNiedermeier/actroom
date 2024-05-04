import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { getDocumentAsync } from "expo-document-picker";
import { trpc } from "@/services/trpc";
import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PlayScreen: FC = () => {
  const { playID } = useLocalSearchParams<{ playID: string }>();
  const navigation = useNavigation();
  const { push } = useRouter();
  const { getPlay } = trpc.useUtils();

  const { data: playData } = trpc.getPlay.useQuery({ ID: playID });

  const updatePlayMutation = trpc.updatePlay.useMutation({
    onSuccess: () => getPlay.invalidate({ ID: playID }),
  });

  const createSignedUploadURLMutation =
    trpc.createSignedUploadURL.useMutation();

  useEffect(() => {
    if (!playData || playData.visited) return;
    updatePlayMutation.mutate({ ID: playID, data: { visited: true } });
  }, [playData]);

  const handleOptionsPress = () => {
    push({ pathname: "/play/[playID]/settings/", params: { playID } });
  };

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

    const signedUploadURL = await createSignedUploadURLMutation.mutateAsync();

    const response = await fetch(signedUploadURL, {
      method: "PUT",
      headers: { "Content-Type": fileBlob.type },
      body: fileBlob,
    });

    if (response.ok) alert("Document upload was successful");
    else alert("Document upload failed");
  };

  useEffect(() => {
    if (playData?.visited === false) selectDocument();
  }, [playData?.visited]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
    </View>
  );
};

export default PlayScreen;
