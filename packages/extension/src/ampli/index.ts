/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/**
 * Ampli - A strong typed wrapper for your Analytics
 *
 * This file is generated by Amplitude.
 * To update run 'ampli pull argent-x'
 *
 * Required dependencies: @amplitude/analytics-browser@^1.3.0
 * Tracking Plan Version: 2
 * Build: 1.0.0
 * Runtime: browser:typescript-ampli-v2
 *
 * [View Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest)
 *
 * [Full Setup Instructions](https://data.eu.amplitude.com/argent/Argent%20(dev)/implementation/argent-x)
 */

import * as amplitude from "@amplitude/analytics-browser"

export type Environment = "argentdev"

export const ApiKey: Record<Environment, string> = {
  argentdev: "2588167f290d46029e53ddfa3e6f4353",
}

/**
 * Default Amplitude configuration options. Contains tracking plan information.
 */
export const DefaultConfiguration: BrowserOptions = {
  plan: {
    version: "2",
    branch: "main",
    source: "argent-x",
    versionId: "21095e9a-a2da-4853-9336-042690b8c4c0",
  },
  ...{
    ingestionMetadata: {
      sourceName: "browser-typescript-ampli",
      sourceVersion: "2.0.0",
    },
  },
  serverZone: amplitude.Types.ServerZone.EU,
}

export interface LoadOptionsBase {
  disabled?: boolean
}

export type LoadOptionsWithEnvironment = LoadOptionsBase & {
  environment: Environment
  client?: { configuration?: BrowserOptions }
}
export type LoadOptionsWithApiKey = LoadOptionsBase & {
  client: { apiKey: string; configuration?: BrowserOptions }
}
export type LoadOptionsWithClientInstance = LoadOptionsBase & {
  client: { instance: BrowserClient }
}

export type LoadOptions =
  | LoadOptionsWithEnvironment
  | LoadOptionsWithApiKey
  | LoadOptionsWithClientInstance

export interface AccountCreatedProperties {
  "account index": string
  "account type": string
}

export interface AccountDeployedProperties {
  "account index": string
  "account type": string
}

export interface DappPreauthorizedProperties {
  host: string
}

export interface OnboardingAnalyticsDecidedProperties {
  "analytics activated": boolean
}

export interface OnboardingCompletedProperties {
  "account type": string
}

export class AccountCreated implements BaseEvent {
  event_type = "Account Created"

  constructor(public event_properties: AccountCreatedProperties) {
    this.event_properties = event_properties
  }
}

export class AccountDeployed implements BaseEvent {
  event_type = "Account Deployed"

  constructor(public event_properties: AccountDeployedProperties) {
    this.event_properties = event_properties
  }
}

export class ApplicationOpened implements BaseEvent {
  event_type = "Application Opened"
}

export class DappPreauthorized implements BaseEvent {
  event_type = "Dapp Preauthorized"

  constructor(public event_properties: DappPreauthorizedProperties) {
    this.event_properties = event_properties
  }
}

export class OnboardingAnalyticsDecided implements BaseEvent {
  event_type = "Onboarding Analytics Decided"

  constructor(public event_properties: OnboardingAnalyticsDecidedProperties) {
    this.event_properties = event_properties
  }
}

export class OnboardingCompleted implements BaseEvent {
  event_type = "Onboarding Completed"

  constructor(public event_properties: OnboardingCompletedProperties) {
    this.event_properties = event_properties
  }
}

export class OnboardingStarted implements BaseEvent {
  event_type = "Onboarding Started"
}

export class WalletLocalStorageCleared implements BaseEvent {
  event_type = "Wallet Local Storage Cleared"
}

export class WalletRestored implements BaseEvent {
  event_type = "Wallet Restored"
}

export type PromiseResult<T> = { promise: Promise<T | void> }

const getVoidPromiseResult = () => ({ promise: Promise.resolve() })

// prettier-ignore
export class Ampli {
  private disabled: boolean = false;
  private amplitude?: BrowserClient;

  get client(): BrowserClient {
    this.isInitializedAndEnabled();
    return this.amplitude!;
  }

  get isLoaded(): boolean {
    return this.amplitude != null;
  }

  private isInitializedAndEnabled(): boolean {
    if (!this.amplitude) {
      console.error('ERROR: Ampli is not yet initialized. Have you called ampli.load() on app start?');
      return false;
    }
    return !this.disabled;
  }

  /**
   * Initialize the Ampli SDK. Call once when your application starts.
   *
   * @param options Configuration options to initialize the Ampli SDK with.
   */
  load(options: LoadOptions): PromiseResult<void> {
    this.disabled = options.disabled ?? false;

    if (this.amplitude) {
      console.warn('WARNING: Ampli is already intialized. Ampli.load() should be called once at application startup.');
      return getVoidPromiseResult();
    }

    let apiKey: string | null = null;
    if (options.client && 'apiKey' in options.client) {
      apiKey = options.client.apiKey;
    } else if ('environment' in options) {
      apiKey = ApiKey[options.environment];
    }

    if (options.client && 'instance' in options.client) {
      this.amplitude = options.client.instance;
    } else if (apiKey) {
      this.amplitude = amplitude.createInstance();
      const configuration = (options.client && 'configuration' in options.client) ? options.client.configuration : {};
      return this.amplitude.init(apiKey, undefined, { ...DefaultConfiguration, ...configuration });
    } else {
      console.error("ERROR: ampli.load() requires 'environment', 'client.apiKey', or 'client.instance'");
    }

    return getVoidPromiseResult();
  }

  /**
   * Identify a user and set user properties.
   *
   * @param userId The user's id.
   * @param options Optional event options.
   */
  identify(
    userId: string | undefined,
    options?: EventOptions,
  ): PromiseResult<Result> {
    if (!this.isInitializedAndEnabled()) {
      return getVoidPromiseResult();
    }

    if (userId) {
      options = {...options,  user_id: userId};
    }

    const amplitudeIdentify = new amplitude.Identify();
    return this.amplitude!.identify(
      amplitudeIdentify,
      options,
    );
  }

 /**
  * Flush the event.
  */
  flush() : PromiseResult<Result> {
    if (!this.isInitializedAndEnabled()) {
      return getVoidPromiseResult();
    }

    return this.amplitude!.flush();
  }

  /**
   * Track event
   *
   * @param event The event to track.
   * @param options Optional event options.
   */
  track(event: Event, options?: EventOptions): PromiseResult<Result> {
    if (!this.isInitializedAndEnabled()) {
      return getVoidPromiseResult();
    }

    return this.amplitude!.track(event, undefined, options);
  }

  /**
   * Account Created
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Account%20Created)
   *
   * Event indicating when a new "mainnet" account is successfully created on the platform. It's undeploeyd and unfunded.
   *
   * 2 places this is fired: 1/ Onboarding: will be fired once. 2/ Add Account (see screenshot):
   *
   *
   *
   *
   * @param properties The event's properties (e.g. account index)
   * @param options Amplitude event options.
   */
  accountCreated(
    properties: AccountCreatedProperties,
    options?: EventOptions,
  ) {
    return this.track(new AccountCreated(properties), options);
  }

  /**
   * Account Deployed
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Account%20Deployed)
   *
   * Event to track when a user successfully deploys their account
   *
   * @param properties The event's properties (e.g. account index)
   * @param options Amplitude event options.
   */
  accountDeployed(
    properties: AccountDeployedProperties,
    options?: EventOptions,
  ) {
    return this.track(new AccountDeployed(properties), options);
  }

  /**
   * Application Opened
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Application%20Opened)
   *
   * Event to track when users open the application
   *
   * @param options Amplitude event options.
   */
  applicationOpened(
    options?: EventOptions,
  ) {
    return this.track(new ApplicationOpened(), options);
  }

  /**
   * Dapp Preauthorized
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Dapp%20Preauthorized)
   *
   * Event has no description in tracking plan.
   *
   * @param properties The event's properties (e.g. host)
   * @param options Amplitude event options.
   */
  dappPreauthorized(
    properties: DappPreauthorizedProperties,
    options?: EventOptions,
  ) {
    return this.track(new DappPreauthorized(properties), options);
  }

  /**
   * Onboarding Analytics Decided
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Onboarding%20Analytics%20Decided)
   *
   * Event to track user decisions and interactions during the onboarding process
   *
   * @param properties The event's properties (e.g. analytics activated)
   * @param options Amplitude event options.
   */
  onboardingAnalyticsDecided(
    properties: OnboardingAnalyticsDecidedProperties,
    options?: EventOptions,
  ) {
    return this.track(new OnboardingAnalyticsDecided(properties), options);
  }

  /**
   * Onboarding Completed
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Onboarding%20Completed)
   *
   * User completes the onboarding
   *
   * @param properties The event's properties (e.g. account type)
   * @param options Amplitude event options.
   */
  onboardingCompleted(
    properties: OnboardingCompletedProperties,
    options?: EventOptions,
  ) {
    return this.track(new OnboardingCompleted(properties), options);
  }

  /**
   * Onboarding Started
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Onboarding%20Started)
   *
   * This starts when user click "Create Wallet" Event to track when a user begins the onboarding process
   *
   * @param options Amplitude event options.
   */
  onboardingStarted(
    options?: EventOptions,
  ) {
    return this.track(new OnboardingStarted(), options);
  }

  /**
   * Wallet Local Storage Cleared
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Wallet%20Local%20Storage%20Cleared)
   *
   * User clears local storage. It is fired when the user access "delete local storage" buton on Settings.
   *
   * @param options Amplitude event options.
   */
  walletLocalStorageCleared(
    options?: EventOptions,
  ) {
    return this.track(new WalletLocalStorageCleared(), options);
  }

  /**
   * Wallet Restored
   *
   * [View in Tracking Plan](https://data.eu.amplitude.com/argent/Argent%20(dev)/events/main/latest/Wallet%20Restored)
   *
   * This event tracks when a user restores their wallet
   *
   * @param options Amplitude event options.
   */
  walletRestored(
    options?: EventOptions,
  ) {
    return this.track(new WalletRestored(), options);
  }
}

export const ampli = new Ampli()

// BASE TYPES
type BrowserOptions = amplitude.Types.BrowserOptions

export type BrowserClient = amplitude.Types.BrowserClient
export type BaseEvent = amplitude.Types.BaseEvent
export type IdentifyEvent = amplitude.Types.IdentifyEvent
export type GroupEvent = amplitude.Types.GroupIdentifyEvent
export type Event = amplitude.Types.Event
export type EventOptions = amplitude.Types.EventOptions
export type Result = amplitude.Types.Result