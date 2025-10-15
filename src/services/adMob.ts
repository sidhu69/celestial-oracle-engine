import { Capacitor } from '@capacitor/core';

// Check if we're on a native platform
const isNativePlatform = Capacitor.isNativePlatform();

// Only import AdMob on native platforms
let AdMob: any = null;
let BannerAdSize: any = null;
let BannerAdPosition: any = null;

if (isNativePlatform) {
  try {
    const admobModule = require('@capacitor-community/admob');
    AdMob = admobModule.AdMob;
    BannerAdSize = admobModule.BannerAdSize;
    BannerAdPosition = admobModule.BannerAdPosition;
  } catch (error) {
    console.log('AdMob not available:', error);
  }
}

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

  async initialize() {
    if (!isNativePlatform || !AdMob) {
      console.log('⚠️ AdMob only works on native platforms');
      return;
    }

    if (this.initialized) {
      console.log('ℹ️ AdMob already initialized');
      return;
    }

    try {
      await AdMob.initialize({
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
    if (!isNativePlatform || !AdMob || !this.initialized) {
      console.log('⚠️ Cannot show banner - not on native platform or not initialized');
      return;
    }

    try {
      const options = {
        adId: CURRENT_AD_UNITS.banner,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
      console.log('✅ Banner ad displayed');
    } catch (error) {
      console.error('❌ Banner error:', error);
    }
  }

  async hideBanner() {
    if (!isNativePlatform || !AdMob) {
      return;
    }

    try {
      await AdMob.hideBanner();
      console.log('✅ Banner hidden');
    } catch (error) {
      console.error('❌ Hide banner error:', error);
    }
  }

  async showInterstitial() {
    if (!isNativePlatform || !AdMob || !this.initialized) {
      console.log('⚠️ Cannot show interstitial - not on native platform or not initialized');
      return;
    }

    try {
      const options = {
        adId: CURRENT_AD_UNITS.interstitial,
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('✅ Interstitial shown');
    } catch (error) {
      console.error('❌ Interstitial error:', error);
    }
  }
}

export const adService = new AdService();
