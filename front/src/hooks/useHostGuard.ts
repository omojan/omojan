export function useHostGuard() {
	function hostGuard(playerId: string, hostPlayerId: string, doFunction: Function) {
		if (playerId === hostPlayerId) {
			doFunction();
		}
	}

	return { hostGuard };
}
