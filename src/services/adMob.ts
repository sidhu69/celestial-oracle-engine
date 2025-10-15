import { Capacitor } from '@capacitor/core';

const isNativePlatform = Capacitor.isNativePlatform();

const AD_UNITS = {
  banner: 'ca-app-pub-3375938019790298/8517932699',
  interstitial: 'ca-app-pub-3375938019790298/8758084772'
};

const TEST_AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712'
};

const USE_TEST_ADS = true;
const CURRENT_AD_UNITS = USE_TEST_ADS ? TEST_AD_UNITS : AD_UNITS;

class AdService {
  private initialized = false;
  private AdMob: any = null;
  private BannerAdSize: any = null;
  private BannerAdPosition: any = null;

  async initialize() {
    if (!isNativePlatform) {
      console.log('Web platform - skipping AdMob');
      return;
    }

    if (this.initialized) {
      console.log('AdMob already initialized');
      return;
    }

    try {
      const admob = await import('@capacitor-community/admob');
      this.AdMob = admob.AdMob;
      this.BannerAdSize = admob.BannerAdSize;
      this.BannerAdPosition = admob.BannerAdPosition;

      await this.AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: USE_TEST_ADS,
      });
      
      this.initialized = true;
      console.log('✅ AdMob initialized');
    } catch (error) {
      console.error('AdMob init failed:', error);
    }
  }

  async showBanner() {
    if (!this.initialized || !this.AdMob) return;

    try {
      await this.AdMob.showBanner({
        adId: CURRENT_AD_UNITS.banner,
        adSize: this.BannerAdSize.BANNER,
        position: this.BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
      console.log('✅ Banner shown');
    } catch (error) {
      console.error('Banner error:', error);
    }
  }

  async hideBanner() {
    if (!this.AdMob) return;
    try {
      await this.AdMob.hideBanner();
    } catch (error) {
      console.error('Hide banner error:', error);
    }
  }

  async showInterstitial() {
    if (!this.initialized || !this.AdMob) return;

    try {
      await this.AdMob.prepareInterstitial({
        adId: CURRENT_AD_UNITS.interstitial,
      });
      await this.AdMob.showInterstitial();
      console.log('✅ Interstitial shown');
    } catch (error) {
      console.error('Interstitial error:', error);
    }
  }
}

export const adService = new AdService();
