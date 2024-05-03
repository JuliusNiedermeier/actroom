import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { getDocumentAsync } from "expo-document-picker";
import { trpc } from "@/services/trpc";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PlayScreen: FC = () => {
  const { playID } = useLocalSearchParams<{ playID: string }>();
  const navigation = useNavigation();
  const { push } = useRouter();

  const { data: playData } = trpc.getPlay.useQuery({ ID: playID });

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

  useEffect(() => {
    if (playData?.visited === false) getDocumentAsync();
  }, [playData?.visited]);

  return <View style={{ flex: 1 }}></View>;
};

export default PlayScreen;
