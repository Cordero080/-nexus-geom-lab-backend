import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function createGeometryByType(type) {
  switch (type) {
    case "icosahedron":
      // Create compound icosahedron - two merged together
      const ico1 = new THREE.IcosahedronGeometry();
      const ico2 = new THREE.IcosahedronGeometry();

      // Rotate second icosahedron to create stella octangula / merkaba effect
      ico2.rotateX(Math.PI / 2);
      ico2.rotateY(Math.PI / 6);

      // Merge the two geometries
      const mergedIco = mergeGeometries([ico1, ico2]);
      // Mark it as compound for wireframe builders
      mergedIco.userData.isCompound = true;
      mergedIco.userData.baseType = "IcosahedronGeometry";

      return mergedIco;
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
