import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Clock, Shield, BookOpen, Heart, Users } from 'lucide-react';

const features = [
  {
    title: 'Educación Personalizada',
    description: 'Aprende a tu ritmo con respuestas adaptadas a tus necesidades específicas',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Disponible 24/7',
    description: 'Acceso inmediato cuando lo necesites, sin esperas ni horarios limitados',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: '100% Confidencial',
    description: 'Conversaciones privadas y seguras. Tu información está protegida',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Recursos Educativos',
    description: 'Accede a guías, artículos y materiales sobre juego responsable',
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Apoyo Empático',
    description: 'Asistencia comprensiva sin juicios, diseñada para ayudarte',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    title: 'Comunidad de Apoyo',
    description: 'Conecta con recursos y comunidades de ayuda profesional',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
];

export function Features() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
            ¿Por qué elegir PlayGPT?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Una herramienta completa diseñada para ayudarte a desarrollar hábitos
            de juego saludables y responsables
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group border-gray-200 transition-all hover:border-green-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} transition-transform group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
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
