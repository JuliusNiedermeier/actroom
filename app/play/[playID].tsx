import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useEffect, useRef } from "react";
import { getDocumentAsync } from "expo-document-picker";
import { trpc } from "@/services/trpc";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { renderBackdrop } from "@/utils/render-backdrop";

const PlayScreen: FC = () => {
  const { playID } = useLocalSearchParams<{ playID: string }>();
  const navigation = useNavigation();
  const { navigate } = useRouter();
  const { listPlayPreviews } = trpc.useUtils();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: playData } = trpc.getPlay.useQuery({ ID: playID });

  const deletePlayMutation = trpc.deletePlay.useMutation({
    onSuccess: () => {
      listPlayPreviews.invalidate();
      navigate("/");
    },
  });

  const handleOptionsPress = () => bottomSheetRef.current?.present();

  useEffect(() => {
    navigation.setOptions({
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

  useEffect(() => {
    if (playData?.visited === false) getDocumentAsync();
  }, [playData?.visited]);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        enableDynamicSizing
        enablePanDownToClose
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 16, gap: 8 }}>
          <Pressable
            onPress={() => deletePlayMutation.mutate({ ID: playID })}
            style={({ pressed }) => ({
              backgroundColor: "red",
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              overflow: "hidden",
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              style={{ color: "white" }}
            />
            <Text style={{ color: "white" }}>Delete</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default PlayScreen;
