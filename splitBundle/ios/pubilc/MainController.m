//
//  MainController.m
//  splitBundle
//
//  Created by barry on 2020/9/13.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "MainController.h"
#import "App1Controller.h"
#import "App2Controller.h"
#import "App3Controller.h"

@interface MainController ()

@end

@implementation MainController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewWillAppear:(BOOL)animated {
  [self.navigationController setNavigationBarHidden: YES];
}

- (void)viewWillDisappear:(BOOL)animated {
  [self.navigationController setNavigationBarHidden:NO];
}

- (IBAction)onClickBusiness1:(id)sender {
  [self.navigationController pushViewController:[App1Controller new] animated:YES];
}

- (IBAction)onClickBusiness2:(id)sender {
  [self.navigationController pushViewController:[App2Controller new] animated:YES];
}

- (IBAction)onClickBusiness3:(id)sender {
  [self.navigationController pushViewController:[App3Controller new] animated:YES];
}

@end
