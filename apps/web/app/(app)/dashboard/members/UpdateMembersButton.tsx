'use client';

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/react";
import { useToast } from "@/hooks/use-toast";

export default function UpdateMembersButton({
    projectId
}: {
    projectId: string;
}) {
    const mutation = trpc.updateMembers.useMutation();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    async function updateMembers() {
        setIsLoading(true);
        try {
            console.log(projectId);
            const { success } = await mutation.mutateAsync({ projectId });
            console.log(success);

            toast({
                title: "Membros atualizados",
                description: "Os membros foram atualizados com sucesso.",
                variant: "success"
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Erro ao atualizar membros",
                description: "Ocorreu um erro ao atualizar os membros. Por favor, tente novamente.",
                variant: "error"
            });
        }
        setIsLoading(false);
    }

    return (
        <Button onClick={updateMembers} isLoading={isLoading} className="w-full">
            Atualizar membros
        </Button>
    )
}