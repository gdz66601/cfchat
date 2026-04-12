import { computed } from "vue";

export function useActiveRoom({ activeRoom, groupSettingsForm }) {
	const activeRoomKey = computed(() =>
		activeRoom.value?.kind && activeRoom.value?.id
			? `${activeRoom.value.kind}:${activeRoom.value.id}`
			: "",
	);

	const canManageActiveRoom = computed(
		() =>
			activeRoom.value &&
			activeRoom.value.kind !== "dm" &&
			activeRoom.value.canManage,
	);

	const hasManageLayer = computed(() =>
		Boolean(activeRoom.value && activeRoom.value.kind !== "dm"),
	);

	const activeRoomSubtitle = computed(() => {
		if (!activeRoom.value) {
			return "从左侧会话列表中选择联系人或群组开始聊天。";
		}

		if (activeRoom.value.kind === "dm") {
			return `与 @${activeRoom.value.otherUser?.username || activeRoom.value.name} 的私信`;
		}

		const visibility =
			activeRoom.value.kind === "private" ? "私有群组" : "公开群组";
		const owner = activeRoom.value.ownerDisplayName
			? ` · 群主 ${activeRoom.value.ownerDisplayName}`
			: "";
		const memberCount = activeRoom.value.memberCount
			? ` · ${activeRoom.value.memberCount} 位成员`
			: "";
		return `${visibility}${owner}${memberCount}`;
	});

	function applyActiveChannel(channel) {
		activeRoom.value = {
			id: channel.id,
			kind: channel.kind,
			name: channel.name,
			description: channel.description,
			avatarUrl: channel.avatarUrl || "",
			avatarKey: channel.avatarKey || "",
			ownerDisplayName: channel.ownerDisplayName || "",
			canManage: Boolean(channel.canManage),
			myRole: channel.myRole || "",
			memberCount: Number(channel.memberCount || 0),
		};

		syncGroupSettingsForm();
	}

	function selectChannel(channel) {
		applyActiveChannel(channel);
	}

	function selectDm(dm) {
		activeRoom.value = {
			id: dm.id,
			kind: "dm",
			name: dm.name,
			otherUser: dm.otherUser,
		};
	}

	function syncGroupSettingsForm() {
		groupSettingsForm.name = activeRoom.value?.name || "";
		groupSettingsForm.avatarUrl = activeRoom.value?.avatarUrl || "";
		groupSettingsForm.avatarKey = activeRoom.value?.avatarKey || "";
	}

	function roomLabel(room) {
		if (!room) {
			return "未选择会话";
		}

		if (room.kind === "dm") {
			return room.otherUser?.displayName || room.name;
		}

		return room.name;
	}

	return {
		activeRoomKey,
		canManageActiveRoom,
		hasManageLayer,
		activeRoomSubtitle,
		applyActiveChannel,
		selectChannel,
		selectDm,
		syncGroupSettingsForm,
		roomLabel,
	};
}
