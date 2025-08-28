import Loader from "@/components/Loader";
import Post from "@/components/Post";
import Story from "@/components/Story";
import { STORIES } from "@/constants/mock-data";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { styles } from "../../styles/feed.styles";

export default function Index() {
  const { signOut } = useAuth();

  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) {
    return <Loader />;
  }

  if (posts.length === 0) {
    return <NoPostsFound />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: widthPercentageToDP(1.3),
          }}
        >
          <Image
            style={{
              width: widthPercentageToDP(6.9),
              height: heightPercentageToDP(3.2),
            }}
            source={require("../../assets/images/clover.png")}
          />
          <Text style={styles.headerTitle}>chimein</Text>
        </View>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-in-outline" size={24} color={COLORS.grey} />
        </TouchableOpacity>
      </View>
      {/* STORIES */}
      <FlatList
        data={STORIES}
        horizontal
        renderItem={({ item }) => <Story story={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);
