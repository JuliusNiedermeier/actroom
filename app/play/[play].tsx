import { useLocalSearchParams, useNavigation } from "expo-router";
import { FC, useEffect } from "react";
import { Text } from "react-native";

const PlayScreen: FC = () => {
  const params = useLocalSearchParams<{ play: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerTitle: params.play });
  }, [navigation]);

  return null;
};

export default PlayScreen;
