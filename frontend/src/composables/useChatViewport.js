import { ref } from "vue";

export function useChatViewport({ activeRoom }) {
	const isMobileViewport = ref(false);
	const mobileView = ref("list");
	const showMemberPanel = ref(true);

	function syncViewportState() {
		const nextIsMobile = window.innerWidth <= 960;
		if (nextIsMobile === isMobileViewport.value) {
			return;
		}

		isMobileViewport.value = nextIsMobile;
		if (nextIsMobile) {
			mobileView.value = activeRoom.value ? "chat" : "list";
			showMemberPanel.value = false;
		} else {
			mobileView.value = "chat";
			showMemberPanel.value = Boolean(
				activeRoom.value && activeRoom.value.kind !== "dm",
			);
		}
	}

	function openConversationView() {
		if (isMobileViewport.value) {
			mobileView.value = "chat";
		}
	}

	function returnToConversationList() {
		if (isMobileViewport.value) {
			mobileView.value = "list";
			showMemberPanel.value = false;
		}
	}

	function toggleMemberPanel() {
		showMemberPanel.value = !showMemberPanel.value;
	}

	return {
		isMobileViewport,
		mobileView,
		showMemberPanel,
		syncViewportState,
		openConversationView,
		returnToConversationList,
		toggleMemberPanel,
	};
}
