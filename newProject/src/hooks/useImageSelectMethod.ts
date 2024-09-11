// import { View, StyleSheet } from "react-native";
// import { IconCameraOutline, IconImageOutline } from "@Components/icons";
// import { TFile } from "../types";
// import { useContext } from "react";
// import { TouchableOpacity } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// // import { getFileFromPickerAsset } from "@/src/utils/file";
// import { SheetContext } from "../components/sheet";
// import { Text } from "@Components/text";
// import { colorsUI, spacing } from "../theme";

// export function useImageSelectMethod(onFileAdd?: (files: TFile[]) => void) {
//   const sheetContext = useContext(SheetContext);
//   const imageSelectorData = [
//     { icon: <IconCameraOutline />, text: "拍照", onPress: clickCamera },
//     { icon: <IconImageOutline />, text: "相册", onPress: clickGallery },
//   ];

//   async function clickGallery() {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false,
//       quality: 0.5,
//       allowsMultipleSelection: true,
//       selectionLimit: 5,
//     });

//     if (result.canceled) return;

//     // const files = await getFileFromPickerAsset(result.assets);

//     // onFileAdd?.(files);
//   }

//   async function clickCamera() {
//     const permission = await ImagePicker.getCameraPermissionsAsync();

//     if (permission.status !== ImagePicker.PermissionStatus.GRANTED) {
//       const res = await ImagePicker.requestCameraPermissionsAsync();

//       if (res.status !== ImagePicker.PermissionStatus.GRANTED) {
//         return;
//       }
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     });

//     if (result.canceled) return;

//     // const files = await getFileFromPickerAsset(result.assets);

//     // onFileAdd?.(files);
//   }

//   return () =>
//     sheetContext?.showSheet({
//       title: "",
//       content: ({ close }) => (
//         <View>
//           <View style={st.imageMethodList}>
//             {imageSelectorData.map((i) => (
//               <TouchableOpacity
//                 key={i.text}
//                 style={st.imageMethodItem}
//                 onPress={async () => {
//                   close();
//                   window.setTimeout(() => {
//                     i.onPress();
//                   }, 800);
//                 }}
//               >
//                 <View style={st.imageIconWrapper}>{i.icon}</View>
//                 <Text>{i.text}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <TouchableOpacity style={st.imageCloseButton} onPress={close}>
//             <Text>取消</Text>
//           </TouchableOpacity>
//         </View>
//       ),
//       closeBtn: <></>,
//       childrenPadding: false,
//     });
// }

// const st = StyleSheet.create({
//   imageCloseButton: {
//     fontSize: 15,
//     lineHeight: 26,
//     fontWeight: 500,
//     alignItems: "center",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderTopColor: colorsUI.Border.default.default1,
//     borderTopWidth: 0.5,
//   },
//   imageMethodList: {
//     flexDirection: "row",
//     paddingBottom: 20,
//   },
//   imageMethodItem: {
//     flex: 1,
//     gap: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imageIconWrapper: {
//     width: 56,
//     height: 56,
//     backgroundColor: colorsUI.Background.gray.default,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: spacing.xxxl,
//   },
// });
