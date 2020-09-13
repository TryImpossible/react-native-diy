//
//  JSBundleBean.m
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "JSBundleBean.h"

@implementation JSBundleBean

- (instancetype) initWithLoaderType:(LoaderType)loaderType url:(NSString *)url {
  self = [super init];
  if(self){
      self.loaderType = loaderType;
      self.url = url;
  }
  return self;
}

@end
