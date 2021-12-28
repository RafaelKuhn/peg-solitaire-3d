
export class Utils {

  public static get IsMobile(): boolean {
    const userAgentMobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobile = userAgentMobileRegex.test(navigator.userAgent);    
    return isMobile;
  }

}