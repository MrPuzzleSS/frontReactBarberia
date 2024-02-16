resolve: {
    fallback: {
      "stream"; require.resolve("stream-browserify"),
      "crypto"; require.resolve("crypto-browserify"),
      "util"; require.resolve("util/")
    }
  }
  