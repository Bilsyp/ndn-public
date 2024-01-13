const bandwidthVideoLowest = 99384; // bandwidth representasi audio
const bandwidthVideoHighest = 8158787; // bandwidth representasi video tertinggi

export const defaultBandwidthEstimate =
  (bandwidthVideoLowest + bandwidthVideoHighest) / 2;

export const config = {
  abr: {
    bandwidthDowngradeTarget: 0.9,
    bandwidthUpgradeTarget: 0.8,
    defaultBandwidthEstimate,
    enabled: true,
    // clearBufferSwitch: true,
    // Jika true, buffer akan dikosongkan selama peralihan. Perilaku otomatis default adalah false untuk menghasilkan transisi yang lebih halus. Pada beberapa perangkat, lebih baik mengosongkan buffer. Nilai default adalah salah.
    switchInterval: 6,
  },

  manifest: {
    retryParameters: {
      backoffFactor: 1.5,
      baseDelay: 500,
      fuzzFactor: 0.3,
      maxAttempts: 3,
      timeout: 3000,
    },
  },
  streaming: {
    lowLatencyMode: true,
    inaccurateManifestTolerance: 0,

    bufferBehind: 20,
    bufferingGoal: 8,
    durationBackoff: 1,
    rebufferingGoal: 3,
    retryParameters: {
      backoffFactor: 2,
      baseDelay: 800,
      fuzzFactor: 0.4,
      maxAttempts: 4,
      timeout: 4000,
    },
    // safeSeekOffset: 3,
    // segmentPrefetchLimit: 0,
  },
};
