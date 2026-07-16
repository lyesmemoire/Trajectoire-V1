"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Input } from "@/components/design-system";
import { User, Mail, Phone, MapPin, Briefcase, Save, Bell, Lock, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthUser } from "@/core/intelligence/profile/useAuthUser";
import { useCandidateGraph } from "@/core/intelligence/profile/useCandidateGraph";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Get current user and candidate graph
  const { userId } = useAuthUser();
  const { graph, loading, updateGraph } = useCandidateGraph(userId || "");
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    currentRole: "",
    company: "",
    linkedIn: "",
  });

  // Load form data from graph
  useEffect(() => {
    if (graph?.identity) {
      setFormData({
        firstName: graph.identity.name.split(" ")[0] || "",
        lastName: graph.identity.name.split(" ").slice(1).join(" ") || "",
        email: graph.identity.email || "",
        phone: graph.identity.phone || "",
        location: graph.identity.location || "",
        currentRole: graph.career.currentRole || "",
        company: "",
        linkedIn: graph.identity.linkedIn || "",
      });
    }
  }, [graph]);

  const handleSave = async () => {
    if (!userId || !graph) return;
    
    setIsSaving(true);
    
    try {
      // Update candidate graph with new data
      await updateGraph({
        identity: {
          ...graph.identity,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          location: formData.location,
          linkedIn: formData.linkedIn,
        },
        career: {
          ...graph.career,
          currentRole: formData.currentRole,
        },
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Mon Profil
        </h1>
        <p className="text-gray-600">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Prénom</label>
                <Input 
                  placeholder="Jean" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Nom</label>
                <Input 
                  placeholder="Dupont" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input 
                type="email" 
                placeholder="jean.dupont@email.com" 
                value={formData.email}
                disabled 
              />
              <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </label>
              <Input 
                type="tel" 
                placeholder="+33 6 12 34 56 78" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localisation
              </label>
              <Input 
                placeholder="Paris, France" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Informations professionnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Poste actuel</label>
              <Input 
                placeholder="Senior Product Manager" 
                value={formData.currentRole}
                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Entreprise</label>
              <Input 
                placeholder="TechCorp" 
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">LinkedIn</label>
              <Input 
                placeholder="linkedin.com/in/jeandupont" 
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Préférences de notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Notifications par email", description: "Recevoir les mises à jour par email" },
              { label: "Rappels de simulation", description: "Rappels pour pratiquer les entretiens" },
              { label: "Offres d'emploi", description: "Recevoir des offres pertinentes" },
              { label: "Newsletter", description: "Conseils et astuces carrière" },
            ].map((pref, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                <div>
                  <h4 className="font-medium text-gray-900">{pref.label}</h4>
                  <p className="text-sm text-gray-500">{pref.description}</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    index < 2 ? "bg-blue-600" : "bg-gray-300"
                  } relative`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                      index < 2 ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Lock className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Activer l'authentification à deux facteurs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            "Enregistrement..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Modifications enregistrées avec succès
        </div>
      )}
    </div>
  );
}
