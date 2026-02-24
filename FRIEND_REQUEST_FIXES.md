# Friend Request Accept/Decline Fixes

## Issues Fixed

### 1. Prisma Enum Validation Error
**Problem**: `Invalid value for argument 'type'. Expected NotificationType` when accepting friend requests.

**Root Cause**:
- Prisma schema had incorrect enum default syntax: `@default("pending")` instead of `@default(pending)`
- Prisma client was not regenerated after schema changes

**Fix**:
- Updated `prisma/schema.prisma` line 163: Changed `@default("pending")` to `@default(pending)`
- Regenerated Prisma client with `npx prisma generate`
- Removed type casting workaround in accept route

### 2. Notifications Not Disappearing After Accept/Decline
**Problem**: After accepting or declining a friend request, the notification remained visible with "Accepted"/"Declined" text.

**Fix**:
- **NotificationsDropdown.tsx**: Added `handleRemoveNotification()` function that removes notifications from state and updates unread count
- **NotificationItem.tsx**:
  - Added `onRemove` prop to component signature
  - Modified `handleFriendRespond()` to call `onRemove(notification.id)` instead of showing action result text
  - Notification is now immediately removed from UI when accept/decline succeeds

### 3. Original Friend Request Notifications Not Cleaned Up
**Problem**: When accepting or rejecting a request, the original `friend_request` notification was not deleted from the database.

**Fix**:
- **accept route** (`src/app/api/friends/[id]/accept/route.ts`):
  - Added deletion of original notification in transaction
  - Deletes notifications with `type: "friend_request"` containing the friend request ID

- **reject route** (`src/app/api/friends/[id]/reject/route.ts`):
  - Wrapped update in transaction
  - Added deletion of original notification
  - Deletes notifications with `type: "friend_request"` containing the friend request ID

### 4. Profile Page Button Updates
**Problem**: Accept/decline buttons on profile page should update instantly to reflect friendship status.

**Fix**:
- **ProfileClient.tsx**: Already had proper refresh logic after accepting
  - Calls `/api/users/${targetUserId}` after accept to get updated friendship status
  - This works correctly now that the accept route is fixed

## Files Modified

1. `prisma/schema.prisma` - Fixed enum default syntax
2. `src/app/api/friends/[id]/accept/route.ts` - Removed type cast, added notification cleanup, enhanced response
3. `src/app/api/friends/[id]/reject/route.ts` - Added transaction and notification cleanup
4. `src/components/notifications/NotificationsDropdown.tsx` - Added remove notification handler
5. `src/components/notifications/NotificationItem.tsx` - Updated to remove notification on action

## Flow After Fixes

### Accept from Notification Dropdown:
1. User clicks "Accept" button
2. API updates friend request to `accepted` status
3. API deletes original `friend_request` notification from DB
4. API creates new `friend_request_accepted` notification for sender
5. API emits socket event to sender
6. Frontend removes notification from dropdown immediately
7. Sender sees new notification that their request was accepted

### Accept from Profile Page:
1. User clicks "Accept Request" button
2. Component fetches friend request ID from `/api/friends/requests`
3. Calls accept API endpoint
4. API updates request and notifications (same as above)
5. Component refetches profile data to get new friendship status
6. Button updates to show "Friends" badge

### Decline from Either Location:
1. User clicks "Decline" button
2. API updates friend request to `rejected` status
3. API deletes original `friend_request` notification from DB
4. Frontend removes notification from dropdown immediately (if from notification)
5. Button disappears from profile (if from profile page)
6. No notification sent to sender (silent reject)

## Testing Checklist

- [x] Build succeeds without errors
- [ ] Accept from notification dropdown removes notification immediately
- [ ] Accept from profile page updates button to "Friends"
- [ ] Decline from notification dropdown removes notification immediately
- [ ] Decline from profile page removes accept button
- [ ] Original friend_request notification is deleted from database
- [ ] Sender receives friend_request_accepted notification
- [ ] Socket.IO events work correctly
- [ ] Unread count updates properly in both scenarios
