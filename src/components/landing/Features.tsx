'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Clock, Shield, BookOpen, Heart, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type FeatureKey = 'education' | 'available' | 'confidential' | 'resources' | 'support' | 'community';

export function Features() {
  const { t } = useLanguage();

  const features: Array<{
    key: FeatureKey;
    icon: typeof GraduationCap;
    color: string;
    bgColor: string;
  }> = [
    {
      key: 'education',
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      key: 'available',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      key: 'confidential',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      key: 'resources',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      key: 'support',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      key: 'community',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
            {t.features.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {t.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const featureData = t.features.items[feature.key];
            return (
              <Card
                key={feature.key}
                className="group border-gray-200 transition-all hover:border-green-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} transition-transform group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{featureData.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {featureData.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
