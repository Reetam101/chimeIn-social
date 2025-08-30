import CommentsModal from "@/components/CommentsModal";
import Loader from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles as postStyles } from "@/styles/feed.styles";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";

type Post = {
  _id: Id<"posts">;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  _creationTime: number;
  isLiked: boolean;
};

const Profile = () => {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const posts = useQuery(api.posts.getPostsByUser, {});

  const [showComments, setShowComments] = useState(false);
  const [likesCount, setLikesCount] = useState(selectedPost?.likes);
  const [commentsCount, setCommentsCount] = useState(selectedPost?.comments);
  const [isLiked, setIsLiked] = useState(selectedPost?.isLiked || false);
  const updateProfile = useMutation(api.users.updateProfile);
  const toggleLike = useMutation(api.posts.toggleLike);
  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: selectedPost?._id! });
      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev! + 1 : prev! - 1));
      // refetch the selectedPost
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  useEffect(() => {});

  console.log(selectedPost);
  console.log(isLiked);
  const handleSaveProfile = async () => {};

  if (!currentUser || posts === undefined) return <Loader />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
          <Text style={styles.name}>{currentUser.fullname}</Text>
          {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {posts.length === 0 && <NoPostsFound />}

        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => setSelectedPost(item)}
            >
              <Image
                source={item.imageUrl}
                style={styles.gridImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* SELECTED IMAGE MODAL */}
      <Modal
        visible={!!selectedPost}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedPost && (
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedPost(null)}>
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
                      name={isLiked ? "heart" : "hearto"}
                      size={22}
                      color={isLiked ? COLORS.primary : COLORS.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}}>
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
                <Text style={postStyles.likesText}>
                  {likesCount! > 0
                    ? `${likesCount?.toLocaleString()} likes`
                    : "Be the first to like"}
                </Text>
                {selectedPost.caption && (
                  <View style={postStyles.captionContainer}>
                    <Text style={postStyles.captionUsername}>
                      {currentUser.username}
                    </Text>
                    <Text style={postStyles.captionText}>
                      {selectedPost.caption}
                    </Text>
                  </View>
                )}

                {selectedPost._creationTime > 0 && (
                  <TouchableOpacity onPress={() => setShowComments(true)}>
                    <Text style={postStyles.commentsText}>
                      View all {selectedPost.comments} comments
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={postStyles.timeAgo}>
                  {formatDistanceToNow(selectedPost._creationTime, {
                    addSuffix: true,
                  })}
                </Text>
              </View>

              <CommentsModal
                postId={selectedPost._id}
                visible={showComments}
                onClose={() => setShowComments(false)}
                onCommentAdded={() => setCommentsCount((prev) => prev! + 1)}
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

function NoPostsFound() {
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: COLORS.background,
        justifyContent: "center",
        gap: 8,
        alignItems: "center",
      }}
    >
      <Ionicons
        name="images-outline"
        size={heightPercentageToDP(4)}
        color={COLORS.surface}
      />
      <Text style={{ fontSize: heightPercentageToDP(2), color: COLORS.white }}>
        No Posts Yet
      </Text>
    </View>
  );
}

export default Profile;
