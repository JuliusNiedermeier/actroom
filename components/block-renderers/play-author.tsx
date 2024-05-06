import { FC } from "react";
import { BlockRendererProps } from ".";
import { Text, View } from "react-native";

export const PlayAuthor: FC<BlockRendererProps> = (block) => {
  return (
    <View style={{ borderRadius: 16, padding: 16, backgroundColor: "white" }}>
      <Text>Written by</Text>
      <Text style={{ fontWeight: "500" }}>{block.content}</Text>
    </View>
  );
};
