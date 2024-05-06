import { FC } from "react";
import { BlockRendererProps } from ".";
import { Text, View } from "react-native";

export const StageDirection: FC<BlockRendererProps> = (block) => {
  return (
    <View style={{ marginVertical: 32, paddingHorizontal: 32 }}>
      <Text style={{ fontStyle: "italic", color: "gray", textAlign: "center" }}>
        {block.content}
      </Text>
    </View>
  );
};
