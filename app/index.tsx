import { useNavigation } from "expo-router";
import { ComponentProps, useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/services/trpc";
import { getDocumentAsync } from "expo-document-picker";

export default function Home() {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const createPlayMutation = trpc.createPlay.useMutation({
    onSuccess: async (data) => {
      bottomSheetRef.current?.close();
      const doc = await getDocumentAsync();
      alert(`Picked ${doc.assets?.length} files`);
    },
  });

  const createScriptOptions = useMemo<
    {
      title: string;
      description: string;
      icon: ComponentProps<typeof Ionicons>["name"];
      disabled?: boolean;
      sourceType: NonNullable<
        typeof createPlayMutation.variables
      >["sourceType"];
    }[]
  >(
    () => [
      {
        title: "From a PDF file",
        description: "Convert a PDF file directly to an Act Room script.",
        icon: "document",
        sourceType: "pdf",
      },
      {
        title: "Scan with your camera",
        description: "Convert a PDF file directly to an",
        icon: "camera",
        disabled: true,
        sourceType: "images",
      },
      {
        title: "Choose from your Gallery",
        description: "Convert a PDF file directly to an",
        icon: "image",
        disabled: true,
        sourceType: "images",
      },
    ],
    []
  );

  useEffect(
    () =>
      navigation.setOptions({
        headerTitle: "Act Room",
        headerRight: () => (
          <Pressable
            onPress={handleAddPress}
            style={({ pressed }) => ({
              padding: 4,
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Ionicons name="add-outline" size={32} />
          </Pressable>
        ),
      }),
    [navigation]
  );

  const handleAddPress = () => bottomSheetRef.current?.present();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        enableDynamicSizing
        enablePanDownToClose
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 16 }}>
          <Text
            style={{ textAlign: "center", fontSize: 18, fontWeight: "500" }}
          >
            New Script
          </Text>
          <View style={{ gap: 8, marginTop: 16 }}>
            {createScriptOptions.map((option) => (
              <Pressable
                disabled={option.disabled}
                key={option.title}
                onPress={() =>
                  createPlayMutation.mutate({ sourceType: option.sourceType })
                }
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "#EDECEC" : "#F6F5F5",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  overflow: "hidden",
                  opacity: option.disabled ? 0.5 : 1,
                })}
              >
                <Ionicons name={option.icon} size={24} />
                <View style={{ flex: 1 }}>
                  {option.disabled && (
                    <Text style={{ color: "pink" }}>Coming soon</Text>
                  )}
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  >
                    {option.title}
                  </Text>
                  <Text style={{ color: "gray" }}>{option.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
