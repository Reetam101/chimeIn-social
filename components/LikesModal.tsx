import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

type LikesModalProps = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
};
const screenHeight = Dimensions.get("window").height;

export default function LikesModal({
  postId,
  visible,
  onClose,
}: LikesModalProps) {
  const likes = useQuery(api.posts.getLikesByPost, { postId });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Likes</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    marginTop: Platform.OS === "ios" ? 44 : 0,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    height: screenHeight * 0.5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: heightPercentageToDP(2),
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: heightPercentageToDP(2),
    fontWeight: "600",
  },
});
