//
//  JSBundleBean.h
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, LoaderType) {
    LoaderTypeASSET = 1,
    LoaderTypeFILE = 2,
    LoaderTypeNETWORK = 3,
};

@interface JSBundleBean : NSObject

@property(nonatomic, assign) LoaderType loaderType;
@property(nonatomic, copy) NSString *url;

-(instancetype)initWithLoaderType:(LoaderType )loaderType url:(NSString *)url;

@end

NS_ASSUME_NONNULL_END
