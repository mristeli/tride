function Vector(_x, _y, _z) {
  this.x = _x;
  this.y = _y;
  this.z = _z;

  this.length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}
Vector.prototype.dirVecFrom = function(other) {
  return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
}
Vector.prototype.cross = function(other) {
  return new Vector(this.y * other.z - this.z * other.y, 
    this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
}
Vector.prototype.dot = function(other) {
  return this.x * other.x + this.y * other.y 
      + this.z * other.z;
}
Vector.prototype.normalize = function() {
  return new Vector(this.x / this.length, this.y / this.length, this.z / this.length);
}
Vector.prototype.translate = function(i, j = 0, k = 0) {
  return new Vector(this.x + i, this.y + j, this.z + k);
}

function Triangle (_v1, _v2, _v3) {
  this.v1 = _v1;
  this.v2 = _v2;
  this.v3 = _v3;
  
  this.normal = this.v2.dirVecFrom(this.v1).cross(this.v3.dirVecFrom(this.v1)).normalize();
}
Triangle.prototype.scale = function(r) {
  return new Triangle(new Vector(this.v1.x * r, this.v1.y * r, this.v1.z * r), 
    new Vector(this.v2.x * r, this.v2.y * r, this.v2.z * r),
    new Vector(this.v3.x * r, this.v3.y * r, this.v3.z * r));
}
Triangle.prototype.translate = function(i, j = 0, k = 0) {
  return new Triangle(this.v1.translate(i, j, k), 
    this.v2.translate(i, j, k), 
    this.v3.translate(i, j, k));
}

function Mesh (tris) {
  this.tris = tris;	
}
Mesh.prototype.scale = function(r) {
  return new Mesh(this.tris.map(tri => tri.scale(r)));
}
Mesh.prototype.translate = function(i, j, k) {
  return new Mesh(this.tris.map(tri => tri.translate(i, j, k)));
}
Mesh.prototype.filterNotvisible = function() {
  const neg = (camera[2] > Math.PI / 2 && camera[2] < 3*Math.PI / 2)  
  return new Mesh(this.tris.filter(tri => {
    const dot_prod = tri.v1.dirVecFrom(camera[1]).dot(tri.normal)
    return dot_prod >= 0
  }))
}
Mesh.prototype.matrixMultiply = function(matrix) {
  return new Mesh(this.tris.map(
    tri => {
      ret = new Triangle(
        multiplyMatrixVector(tri.v1, matrix),
        multiplyMatrixVector(tri.v2, matrix),
        multiplyMatrixVector(tri.v3, matrix))
      ret.fillStyle = tri.fillStyle;
      return ret;
    }));
}
