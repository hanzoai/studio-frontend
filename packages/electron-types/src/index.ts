// ---- Download types ----

export enum DownloadStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  DOWNLOADING = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
  CANCELLED = 'cancelled'
}

export interface DownloadState {
  url: string
  filename: string
  savePath?: string
  status: DownloadStatus
  progress?: number
  error?: string
}

// ---- Torch / GPU types ----

export type TorchDeviceType = 'cpu' | 'nvidia' | 'mps'

export enum TorchMirrorUrl {
  NightlyCpu = 'https://download.pytorch.org/whl/nightly/cpu',
  Cuda = 'https://download.pytorch.org/whl/cu124'
}

// ---- Install types ----

export const InstallStage = {
  WELCOME_SCREEN: 'welcome_screen',
  INSTALL_OPTIONS_SELECTION: 'install_options_selection',
  CREATING_DIRECTORIES: 'creating_directories',
  INITIALIZING_CONFIG: 'initializing_config',
  PYTHON_ENVIRONMENT_SETUP: 'python_environment_setup',
  INSTALLING_REQUIREMENTS: 'installing_requirements',
  INSTALLING_PYTORCH: 'installing_pytorch',
  INSTALLING_COMFYUI_REQUIREMENTS: 'installing_comfyui_requirements',
  INSTALLING_MANAGER_REQUIREMENTS: 'installing_manager_requirements',
  MIGRATING_CUSTOM_NODES: 'migrating_custom_nodes',
  READY: 'ready',
  ERROR: 'error'
} as const

export type InstallStageName = (typeof InstallStage)[keyof typeof InstallStage]

export interface InstallStageInfo {
  stage: InstallStageName
  progress?: number
  message?: string
  error?: string
  timestamp?: number
}

export enum ProgressStatus {
  INITIAL_STATE = 'initial_state',
  DOWNLOADING = 'in_progress',
  READY = 'ready',
  ERROR = 'error',
  STARTED = 'started'
}

export interface InstallOptions {
  installPath: string
  autoUpdate: boolean
  allowMetrics: boolean
  migrationSourcePath: string
  migrationItemIds: string[]
  pythonMirror: string
  pypiMirror: string
  torchMirror: string
  device: TorchDeviceType
}

// ---- Migration types ----

export interface MigrationItem {
  id: string
  label: string
  description?: string
}

export const MigrationItems: MigrationItem[] = [
  { id: 'custom_nodes', label: 'Custom Nodes' },
  { id: 'models', label: 'Models' },
  { id: 'input', label: 'Input Files' },
  { id: 'output', label: 'Output Files' }
]

// ---- Validation types ----

export type ValidationState = 'warning' | 'error' | 'OK' | 'skipped'

export interface InstallValidation {
  basePath: ValidationState
  inProgress: boolean
  unsafeBasePath?: boolean
  unsafeBasePathReason?: string
  [key: string]: ValidationState | boolean | string | undefined
}

// ---- Electron API types ----

export interface ElectronAPI {
  /** Install Hanzo Studio with the given options */
  installHanzoStudio: (options: InstallOptions) => void

  /** Download manager for model/file downloads */
  DownloadManager: {
    getAllDownloads: () => Promise<DownloadState[]>
    startDownload: (url: string, savePath: string, filename: string) => void
    pauseDownload: (url: string) => void
    resumeDownload: (url: string) => void
    cancelDownload: (url: string) => void
    onDownloadProgress: (
      callback: (data: DownloadState & { progress: number }) => void
    ) => void
  }

  /** Install stage tracking */
  InstallStage: {
    onUpdate: (callback: (info: InstallStageInfo) => void) => () => void
    getCurrent: () => Promise<InstallStageInfo>
  }

  /** Installation validation */
  Validation: {
    validateInstallation: (
      callback: (update: InstallValidation) => void
    ) => Promise<void>
  }

  /** Event tracking */
  Events: {
    trackEvent: (name: string, data?: Record<string, unknown>) => void
    incrementUserProperty: (name: string, value: number) => void
  }

  /**
   * Native context menu. The page passes what kind of thing was clicked so the
   * shell can offer the right items; omitting it asks for the default menu.
   */
  showContextMenu: (options?: { type?: 'text' }) => void

  /** The desktop shell's own version, shown in the about panel. */
  getElectronVersion: () => Promise<string>

  /** Runtime configuration the shell owns rather than the page. */
  Config: {
    setWindowStyle: (style: 'default' | 'custom') => void
  }

  /**
   * Restart the app. The message and delay are what the shell shows while it
   * waits, so a caller that has nothing to say passes neither.
   */
  restartApp: (message?: string, delay?: number) => void

  /** Reinstall, and quit — each ends the current session. */
  reinstall: () => void
  quit: () => void

  /** Ask the update channel, without letting it act on the answer. */
  checkForUpdates: (options?: {
    disableUpdateReadyAction?: boolean
  }) => Promise<{
    isUpdateAvailable: boolean
    version?: string
  }>

  /** Apply an update already downloaded, which restarts the app. */
  restartAndInstall: () => void

  /** The OS, as node names it: 'darwin', 'win32', 'linux'. */
  getPlatform: () => string

  /** The app's own version, distinct from the shell's. */
  getHanzoStudioVersion: () => string

  /**
   * Tint the native window chrome to match the page. `height` lets the shell
   * align its drag region with a top menu the page has already laid out.
   */
  changeTheme: (theme: {
    color: string
    symbolColor: string
    height?: number
  }) => void

  /** The shell's own network reach, which the page cannot test for itself. */
  NetWork: {
    canAccessUrl: (url: string) => Promise<boolean>
  }

  /** The pty behind the command terminal. */
  Terminal: {
    write: (data: string) => Promise<void>
    resize: (cols: number, rows: number) => Promise<void>
    /** Returns its own unsubscribe, called on unmount. */
    onOutput: (callback: (message: string) => void) => () => void
    /** Replays what the pty buffered while the panel was closed. */
    restore: () => Promise<{
      buffer: string[]
      size: { cols: number; rows: number }
    }>
  }

  /** Reveal a directory the shell owns in the OS file manager. */
  openLogsFolder: () => void
  openModelsFolder: () => void
  openOutputsFolder: () => void
  openInputsFolder: () => void
  openCustomNodesFolder: () => void
  openModelConfig: () => void
  openDevTools: () => void
}
