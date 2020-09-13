//
//  App3Controller.m
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "App3Controller.h"

@interface App3Controller ()

@end

@implementation App3Controller

- (JSBundleBean *)getLoaderType {
  return [[JSBundleBean alloc] initWithLoaderType: LoaderTypeASSET url:@"app3.ios.bundle"];
}

- (NSString *)getMainComponentName {
  return @"app3";
}

@end
