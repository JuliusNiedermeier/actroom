import { trpc } from "@/services/trpc";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { Pressable, View, Text } from "react-native";

const PlaySettingsScreen: FC = () => {
  const { playID } = useLocalSearchParams<{ playID: string }>();
  const navigation = useNavigation();
  const { navigate } = useRouter();
  const { play } = trpc.useUtils();

  const deletePlayMutation = trpc.play.delete.useMutation({
    onSuccess: () => {
      play.listPreviews.invalidate();
      navigate("/");
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Play settings",
    });
  }, [navigation]);

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Pressable
        style={({ pressed }) => ({
          backgroundColor: "white",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          overflow: "hidden",
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Ionicons name="people-outline" size={20} />
        <Text style={{ flex: 1 }}>Roles</Text>
        <View
          style={{
            flexDirection: "row",
            gap: -10,
          }}
        >
          {Array.from(new Array(4)).map((_, index) => (
            <View
              key={index}
              style={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: "lightgray",
                borderWidth: 3,
                borderColor: "white",
              }}
            ></View>
          ))}
        </View>
        <Ionicons name="chevron-forward-outline" size={20} />
      </Pressable>
      <Pressable
        onPress={() => deletePlayMutation.mutate({ ID: playID })}
        style={({ pressed }) => ({
          backgroundColor: "red",
          borderRadius: 16,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          overflow: "hidden",
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <Ionicons name="trash-outline" size={20} style={{ color: "white" }} />
        <Text style={{ color: "white" }}>Delete</Text>
      </Pressable>
    </View>
  );
};

export default PlaySettingsScreen;
