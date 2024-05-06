import { FC } from "react";
import { BlockRendererProps } from ".";
import { Text, View } from "react-native";

export const PlayTitle: FC<BlockRendererProps> = (block) => {
  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 30, textAlign: "center" }}>
        {block.content.replaceAll("\n", " ")}
      </Text>
    </View>
  );
};
