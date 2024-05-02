import { useLocalSearchParams, useNavigation } from "expo-router";
import { FC, useEffect } from "react";
import { getDocumentAsync } from "expo-document-picker";

const PlayScreen: FC = () => {
  const params = useLocalSearchParams<{
    play: string;
    title: string;
    firstVisit?: "true";
  }>();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: params.title });
  }, [navigation]);

  useEffect(() => {
    if (Boolean(params.firstVisit)) getDocumentAsync();
  }, [params.firstVisit]);

  return null;
};

export default PlayScreen;
