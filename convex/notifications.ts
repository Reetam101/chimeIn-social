import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getNotifications = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const notifications = await ctx.db
      .query("notificaions")
      .withIndex("by_reciever", (q) => q.eq("recieverId", currentUser._id))
      .order("desc")
      .collect();

    const notificationsWithInfo = await Promise.all(
      notifications.map(async (notif) => {
        const sender = (await ctx.db.get(notif.senderId))!;
        let post = null;
        let comment = null;

        if (notif.postId) {
          post = await ctx.db.get(notif.postId);
        }
        if (notif.type === "comment" && notif.commentId) {
          comment = await ctx.db.get(notif.commentId);
        }

        return {
          ...notif,
          sender: {
            _id: sender._id,
            username: sender.username,
            image: sender.image,
          },
          post,
          comment: comment?.content,
        };
      })
    );

    return notificationsWithInfo;
  },
});
