import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles as postStyles } from "@/styles/feed.styles";
import { styles } from "@/styles/profile.styles";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import CommentsModal from "./CommentsModal";
import LikesModal from "./LikesModal";

type PostModalProps = {
  postId: Id<"posts">;
  userId: Id<"users">;
  visible: boolean;
  onClose: () => void;
};

const PostModal = ({ postId, userId, visible, onClose }: PostModalProps) => {
  let selectedPost = useQuery(api.posts.getPostById, {
    userId,
    postId,
  });

  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(selectedPost?.comments);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [isLiked, setIsLiked] = useState(selectedPost?.isLiked);
  const [likesCount, setLikesCount] = useState(selectedPost?.likes);
  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: selectedPost?._id! });
      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev! + 1 : prev! - 1));
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {selectedPost && (
          <View style={styles.postDetailContainer}>
            <View style={styles.postDetailHeader}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.surface} />
              </TouchableOpacity>
            </View>

            <Image
              source={selectedPost.imageUrl}
              cachePolicy={"memory-disk"}
              style={styles.postDetailImage}
            />
            {/* POST actions */}
            <View style={postStyles.postActions}>
              <View style={postStyles.postActionsLeft}>
                <TouchableOpacity onPress={handleLike}>
                  <AntDesign
                    name={
                      (isLiked ?? selectedPost?.isLiked) ? "heart" : "hearto"
                    }
                    size={22}
                    color={
                      (isLiked ?? selectedPost?.isLiked)
                        ? COLORS.primary
                        : COLORS.white
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowComments(true)}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* POST INFO */}
            <View style={postStyles.postInfo}>
              <TouchableOpacity onPress={() => setShowLikesModal(true)}>
                <Text style={postStyles.likesText}>
                  {selectedPost.likes! > 0
                    ? `${selectedPost.likes?.toLocaleString()} likes`
                    : "Be the first to like"}
                </Text>
              </TouchableOpacity>
              {selectedPost.caption && (
                <View style={postStyles.captionContainer}>
                  <Text style={postStyles.captionUsername}>
                    {selectedPost.user.username}
                  </Text>
                  <Text style={postStyles.captionText}>
                    {selectedPost.caption}
                  </Text>
                </View>
              )}

              {selectedPost._creationTime! > 0 && (
                <TouchableOpacity onPress={() => setShowComments(true)}>
                  <Text style={postStyles.commentsText}>
                    View all {selectedPost.comments} comments
                  </Text>
                </TouchableOpacity>
              )}
              <Text style={postStyles.timeAgo}>
                {formatDistanceToNow(selectedPost._creationTime!, {
                  addSuffix: true,
                })}
              </Text>
            </View>

            <CommentsModal
              postId={selectedPost._id!}
              visible={showComments}
              onClose={() => setShowComments(false)}
              onCommentAdded={() => setCommentsCount((prev) => prev! + 1)}
            />

            <LikesModal
              postId={selectedPost._id!}
              visible={showLikesModal}
              onClose={() => setShowLikesModal(false)}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default PostModal;
