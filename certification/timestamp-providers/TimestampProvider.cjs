/**
 * Interface pour les fournisseurs d'horodatage.
 * Reçoit un digest et retourne une Evidence de Timestamp normalisée.
 */
class TimestampProvider {
  /**
   * @param {Object} request
   * @param {string} request.artifactId
   * @param {Object} request.digest
   * @param {string} request.digest.algorithm
   * @param {string} request.digest.value
   * @param {Object} request.signatureDigest
   * @param {string} request.signatureDigest.algorithm
   * @param {string} request.signatureDigest.value
   */
  async generateEvidence(request) {
    throw new Error("Not implemented");
  }
}

module.exports = TimestampProvider;
