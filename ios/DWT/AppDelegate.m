/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTLinkingManager.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"

@import GoogleMobileAds;
@import Firebase;
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  NSURL *jsCodeLocation;
  //Add these 3 lines
//  if(FIRApp.defaultApp == nil){
//  if(![FIRApp defaultApp]){
//    [FIRApp configure];
//
//  }
//  }
  
//  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
//  [RNFirebaseNotifications configure];
  
  [GMSServices provideAPIKey:@"AIzaSyA30fMP5nXMS9iH6G7LjdZ47vUzLWbnBM0"];
  //  GMSPlacesClient.provideAPIKey("AIzaSyA30fMP5nXMS9iH6G7LjdZ47vUzLWbnBM0")

  //Google sdk ads
  [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"DWT"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

    [[FBSDKApplicationDelegate sharedInstance] application:application
                                    didFinishLaunchingWithOptions:launchOptions];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
//  [FIRApp configure];
  return YES;

}
  
- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return
  [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                annotation:annotation]
  ||
  [RCTLinkingManager application:application openURL:url
               sourceApplication:sourceApplication annotation:annotation];
}


@end
