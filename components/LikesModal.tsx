import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Loader from "./Loader";

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

        {likes === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={likes}
            renderItem={({ item }) => <Like like={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.likesList}
          />
        )}
      </View>
    </Modal>
  );
}

function Like({
  like,
}: {
  like: {
    user: {
      fullname: string;
      image: string;
    };
    _id: Id<"likes">;
    _creationTime: number;
    postId: Id<"posts">;
    userId: Id<"users">;
  };
}) {
  console.log("like: ", like);

  return (
    <View style={styles.likeContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: widthPercentageToDP(4),
        }}
      >
        <Image
          source={like.user.image}
          style={styles.likeAvatar}
          contentFit="contain"
          transition={200}
        />
        <Text
          style={{
            color: COLORS.surface,
            fontSize: heightPercentageToDP(1.5),
          }}
        >
          {like.user.fullname}
        </Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={{ color: COLORS.white }}>Follow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(4),
    paddingTop: heightPercentageToDP(1.5),
    backgroundColor: COLORS.backgroundLight,
    marginTop: Platform.OS === "ios" ? 44 : 0,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: 16,
    height: heightPercentageToDP(4),
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: heightPercentageToDP(2),
    fontWeight: "600",
  },
  likesList: {
    flex: 1,
  },
  likeAvatar: {
    width: widthPercentageToDP(14),
    height: heightPercentageToDP(6.5),
    borderRadius: widthPercentageToDP(50),
  },
  followButton: {
    width: widthPercentageToDP(30),
    alignItems: "center",
    paddingVertical: heightPercentageToDP(1),
    // paddingHorizontal: widthPercentageToDP(15),
    backgroundColor: COLORS.primary,
    borderRadius: widthPercentageToDP(3),
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(1),
  },
});
