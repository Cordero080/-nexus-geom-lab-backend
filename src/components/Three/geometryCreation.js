import * as THREE from "three";

export function createGeometryByType(type) {
  switch (type) {
    case "icosahedron":
      return new THREE.IcosahedronGeometry();
    case "sphere":
      return new THREE.SphereGeometry(1, 16, 16);
    case "box":
      return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case "octahedron":
      return new THREE.OctahedronGeometry();
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(1.2);
    case "torusknot":
      return new THREE.TorusKnotGeometry(1, 0.2, 150, 16);
    default:
      return new THREE.IcosahedronGeometry();
  }
}
