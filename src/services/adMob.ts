import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

// Google's TEST ad unit IDs (works without Play Store)
const TEST_ADS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917'
};

export class AdService {
  
  async initialize() {
    await AdMob.initialize({
      initializeForTesting: true
    });
  }

  async showBanner() {
    const options: BannerAdOptions = {
      adId: TEST_ADS.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
    };
    await AdMob.showBanner(options);
  }

  async hideBanner() {
    await AdMob.hideBanner();
  }

  async showInterstitial() {
    await AdMob.prepareInterstitial({ adId: TEST_ADS.interstitial });
    await AdMob.showInterstitial();
  }
}

export const adService = new AdService();
