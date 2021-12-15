
export class Utils {
  private static isMobile: boolean = null;
  public static get IsMobile() {
    if (Utils.isMobile === null) {
      Utils.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return Utils.isMobile;
  }


}