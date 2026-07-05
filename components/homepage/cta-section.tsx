"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <Section padding="xl" id="tarifs">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-2xl p-12 md:p-16 text-center shadow-premium"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Votre prochaine opportunité commence maintenant
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Ne laissez pas passer votre prochain entretien. Rejoignez les +1,200 professionnels qui ont transformé leur carrière avec Trajectoire. Garantie satisfaction ou remboursement intégral.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <a href="/auth/signup">
                <span className="flex items-center gap-2">
                  Commencer maintenant
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <a href="/contact">
                Réserver un appel découverte
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Pas d'engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Satisfaction garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Support 7j/7</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
