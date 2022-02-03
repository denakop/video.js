/**
 * Check if volume control is supported and if it isn't hide the
 * `Component` that was passed  using the `dk-vjs-hidden` class.
 *
 * @param {Component} self
 *        The component that should be hidden if volume is unsupported
 *
 * @param {Player} player
 *        A reference to the player
 *
 * @private
 */
const checkVolumeSupport = function(self, player) {
  // hide volume controls when they're not supported by the current tech
  if (player.tech_ && !player.tech_.featuresVolumeControl) {
    self.addClass('dk-vjs-hidden');
  }

  self.on(player, 'loadstart', function() {
    if (!player.tech_.featuresVolumeControl) {
      self.addClass('dk-vjs-hidden');
    } else {
      self.removeClass('dk-vjs-hidden');
    }
  });
};

export default checkVolumeSupport;
