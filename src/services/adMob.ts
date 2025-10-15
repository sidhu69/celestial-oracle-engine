import { Capacitor } from '@capacitor/core';
import type { 
  AdMob as AdMobType, 
  BannerAdOptions, 
  InterstitialAdOptions,
  BannerAdSize as BannerAdSizeType,
  BannerAdPosition as BannerAdPositionType
} from '@capacitor-community/admob';

// Check if we're on a native platform
const isNativePlatform = Capacitor.isNativePlatform();

// Your actual Ad Unit IDs from AdMob
const AD_UNITS = {
  banner: 'ca-app-pub-3375938019790298/8517932699',
  interstitial: 'ca-app-pub-3375938019790298/8758084772'
};

// Google's test IDs for development
const TEST_AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712'
};

// Set to true for testing, false for production
const USE_TEST_ADS = true;

const CURRENT_AD_UNITS = USE_TEST_ADS ? TEST_AD_UNITS : AD_UNITS;

class AdService {
  private initialized = false;
  private AdMob: typeof AdMobType | null = null;
  private BannerAdSize: typeof BannerAdSizeType | null = null;
  private BannerAdPosition: typeof BannerAdPositionType | null = null;

  async initialize() {
    if (!isNativePlatform) {
      console.log('⚠️ AdMob only works on native platforms');
      return;
    }

    if (this.initialized) {
      console.log('ℹ️ AdMob already initialized');
      return;
    }

    try {
      // Dynamic import - only loads on native platforms
      const admobModule = await import('@capacitor-community/admob');
      this.AdMob = admobModule.AdMob;
      this.BannerAdSize = admobModule.BannerAdSize;
      this.BannerAdPosition = admobModule.BannerAdPosition;

      await this.AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: USE_TEST_ADS,
      });
      
      this.initialized = true;
      console.log('✅ AdMob initialized');
    } catch (error) {
      console.error('❌ AdMob init error:', error);
    }
  }

  async showBanner() {
    if (!isNativePlatform || !this.AdMob || !this.initialized) {
      console.log('⚠️ Cannot show banner - not on native platform or not initialized');
      return;
    }

    try {
      const options: BannerAdOptions = {
        adId: CURRENT_AD_UNITS.banner,
        adSize: this.BannerAdSize!.BANNER,
        position: this.BannerAdPosition!.BOTTOM_CENTER,
        margin: 0,
      };

      await this.AdMob.showBanner(options);
      console.log('✅ Banner ad displayed');
    } catch (error) {
      console.error('❌ Banner error:', error);
    }
  }

  async hideBanner() {
    if (!isNativePlatform || !this.AdMob) {
      return;
    }

    try {
      await this.AdMob.hideBanner();
      console.log('✅ Banner hidden');
    } catch (error) {
      console.error('❌ Hide banner error:', error);
    }
  }

  async showInterstitial() {
    if (!isNativePlatform || !this.AdMob || !this.initialized) {
      console.log('⚠️ Cannot show interstitial - not on native platform or not initialized');
      return;
    }

    try {
      const options: InterstitialAdOptions = {
        adId: CURRENT_AD_UNITS.interstitial,
      };

      await this.AdMob.prepareInterstitial(options);
      await this.AdMob.showInterstitial();
      console.log('✅ Interstitial shown');
    } catch (error) {
      console.error('❌ Interstitial error:', error);
    }
  }
}

export const adService = new AdService();
