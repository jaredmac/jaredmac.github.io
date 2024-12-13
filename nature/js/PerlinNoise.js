class PerlinNoise {
    constructor() {
      this.p = [];
      this.gradients = [];
      
      // Initialize the permutation table with values 0 to 255
      for (let i = 0; i < 256; i++) {
        this.p[i] = i;
      }
  
      // Shuffle the permutation table
      this.shuffle(this.p);
      this.permute();
  
      // Initialize gradients (normalized vectors)
      this.gradients = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, 1], [1, -1], [-1, -1]
      ];
    }
  
    // Helper function to shuffle the permutation table
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    // Duplicate the permutation table to avoid overflow during hashing
    permute() {
      this.p = [...this.p, ...this.p];
    }
  
    // Fade function: This smooths the interpolation
    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
  
    // Dot product to get the gradient contribution
    grad(hash, x, y) {
      const h = hash & 7;
      const grad = this.gradients[h];
      return grad[0] * x + grad[1] * y;
    }
  
    // Interpolation between a and b using fade
    lerp(a, b, t) {
      return a + t * (b - a);
    }
  
    // Perlin noise function
    noise(x, y) {
      // Determine grid cell
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;

      // Relative position within the grid square
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
  
      // Fade the relative coordinates
      const u = this.fade(xf);
      const v = this.fade(yf);

      // Hash coordinates of the 4 corners
      const aa = this.p[X + this.p[Y]] & 255;
      const ab = this.p[X + this.p[Y + 1]] & 255;
      const ba = this.p[X + 1 + this.p[Y]] & 255;
      const bb = this.p[X + 1 + this.p[Y + 1]] & 255;
  
      // Calculate gradient for each corner
      const x1 = this.lerp(this.grad(this.p[aa], xf, yf), this.grad(this.p[ba], xf - 1, yf), u);
      const x2 = this.lerp(this.grad(this.p[ab], xf, yf - 1), this.grad(this.p[bb], xf - 1, yf - 1), u);

      // Return final result
      return this.lerp(x1, x2, v);
    }

    // Generate a 2D terrain map using Perlin noise
    generateTerrain(width, height, scale) {
        const terrain = [];
        for (let y = 0; y < height; y++) {
            terrain[y] = [];
            for (let x = 0; x < width; x++) {
            // Scale the input coordinates to avoid huge numbers
            const nx = x / scale;
            const ny = y / scale;

            // Get the Perlin noise value for the coordinates
            terrain[y][x] = this.noise(nx, ny);
            }
        }
        return terrain;
    }
}