export default class BrowserData {

  public static get IsMobile(): boolean {
    const userAgentMobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = userAgentMobileRegex.test(navigator.userAgent);    
    return isMobile;
  }

	public static get IsDebugMode(): boolean {
		return window.location.hash === "#debug";
	}

}