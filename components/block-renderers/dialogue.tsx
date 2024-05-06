import { FC } from "react";
import { BlockRendererProps } from ".";
import { Text, View } from "react-native";

export const Dialogue: FC<BlockRendererProps> = (block) => {
  return (
    <View style={{ marginTop: 32 }}>
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <View
          style={{
            height: 24,
            width: 24,
            borderRadius: 12,
            backgroundColor: "lightgray",
          }}
        />
        <Text style={{ fontWeight: "500" }}>{block.role}</Text>
      </View>
      <Text style={{ marginTop: 8, fontSize: 16 }}>{block.content}</Text>
    </View>
  );
};
