import { FC } from "react";
import { BlockRendererProps } from ".";
import { Text, View } from "react-native";

export const SceneTitle: FC<BlockRendererProps> = (block) => {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ textAlign: "center" }}>Scene</Text>
      <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
        {block.content}
      </Text>
    </View>
  );
};
