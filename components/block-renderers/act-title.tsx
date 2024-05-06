import { FC } from "react";
import { BlockRendererProps } from ".";
import { Text, View } from "react-native";

export const ActTitle: FC<BlockRendererProps> = (block) => {
  return (
    <View
      style={{
        marginTop: 32,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
      }}
    >
      <Text style={{ textAlign: "center" }}>Act</Text>
      <Text style={{ fontWeight: "bold", fontSize: 24, textAlign: "center" }}>
        {block.content}
      </Text>
    </View>
  );
};
