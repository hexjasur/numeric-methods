package com.numericmethods.jksoftware

import android.graphics.Color
import android.os.Bundle
import androidx.core.view.WindowCompat
import app.tauri.plugin.TauriActivity

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Ensure content stays below the system status bar and above the navigation bar
    WindowCompat.setDecorFitsSystemWindows(window, true)

    window.statusBarColor = Color.parseColor("#0a0b0d")
    window.navigationBarColor = Color.parseColor("#0a0b0d")

    val controller = WindowCompat.getInsetsController(window, window.decorView)
    controller.isAppearanceLightStatusBars = false
    controller.isAppearanceLightNavigationBars = false
  }
}
