import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

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
  private isNative = Capacitor.isNativePlatform();

  async initialize() {
    if (!this.isNative) {
      console.log('⚠️ AdMob only works on native platforms');
      return;
    }

    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: USE_TEST_ADS,
      });
      console.log('✅ AdMob initialized');
    } catch (error) {
      console.error('❌ AdMob init error:', error);
    }
  }

  async showBanner() {
    if (!this.isNative) return;

    const options: BannerAdOptions = {
      adId: CURRENT_AD_UNITS.banner,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };

    try {
      await AdMob.showBanner(options);
      console.log('✅ Banner ad displayed');
    } catch (error) {
      console.error('❌ Banner error:', error);
    }
  }

  async hideBanner() {
    if (!this.isNative) return;

    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('❌ Hide banner error:', error);
    }
  }

  async showInterstitial() {
    if (!this.isNative) return;

    const options: InterstitialAdOptions = {
      adId: CURRENT_AD_UNITS.interstitial,
    };

    try {
      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('✅ Interstitial shown');
    } catch (error) {
      console.error('❌ Interstitial error:', error);
    }
  }
}

export const adService = new AdService();
