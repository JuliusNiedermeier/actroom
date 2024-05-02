import { useLocalSearchParams, useNavigation } from "expo-router";
import { FC, useEffect } from "react";
import { getDocumentAsync } from "expo-document-picker";
import { trpc } from "@/services/trpc";

const PlayScreen: FC = () => {
  const { playID } = useLocalSearchParams<{ playID: string }>();
  const navigation = useNavigation();

  const { data: playData } = trpc.getPlay.useQuery({ ID: playID });

  useEffect(() => {
    navigation.setOptions({ headerTitle: playData?.title || "" });
  }, [navigation, playData]);

  useEffect(() => {
    if (playData?.visited === false) getDocumentAsync();
  }, [playData?.visited]);

  return null;
};

export default PlayScreen;
